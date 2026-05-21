import './App.less';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useMonaco } from '@monaco-editor/react';
import { App as AntdApp, ConfigProvider, Result, Spin } from 'antd';
import Logger from 'js-logger';
import _isNil from 'lodash/isNil';
import { IDisposable, languages } from 'monaco-editor';
import { OpenAPIV3 } from 'openapi-types';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import config from 'shogunApplicationConfig';

import Header from './Component/Header/Header';
import ShogunSpinner from './Component/ShogunSpinner/ShogunSpinner';
import useAppDispatch from './Hooks/useAppDispatch';
import useAppSelector from './Hooks/useAppSelector';
import useExecuteWfsDescribeFeatureType, { DescribeFeatureType } from './Hooks/useExecuteWfsDescribeFeatureType';
import useSHOGunAPIClient from './Hooks/useSHOGunAPIClient';
import Portal from './Page/Portal/Portal';
import { setAppInfo } from './store/appInfo';
import { setLayerSuggestionList } from './store/layerSuggestionList';
import { setOpenApiDocs } from './store/openApiDocs';
import { setUserInfo } from './store/userInfo';

import ProviderResult = languages.ProviderResult;
import CompletionList = languages.CompletionList;
import CompletionItem = languages.CompletionItem;

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();
  const [propertyNames, setPropertyNames] = useState<string[]>([]);

  const disposableCompletionItemProviderRef = useRef<IDisposable>(null);

  const layerSuggestionList = useAppSelector(state => state.layerSuggestionList);
  const entityId = useAppSelector(state => state.entityId);

  const dispatch = useAppDispatch();

  const client = useSHOGunAPIClient();

  const monaco = useMonaco();

  // Fetch initial data:
  // - swagger docs
  // - applicationInfo
  // - logged in User
  const {
    t
  } = useTranslation();

  useEffect(() => {
    const setLayers = async() => {
      try {
        const layers = await client?.layer().findAllNoPaging();
        if (!_isNil(layers)) {
          dispatch(setLayerSuggestionList(layers));
        }

        if (disposableCompletionItemProviderRef.current) {
          disposableCompletionItemProviderRef.current.dispose();
        }
      } catch (error) {
        Logger.error(error);
      }
    };
    setLayers();
  }, [dispatch, client]);

  const getInitialData = useCallback(async () => {
    try {
      setLoadingState('loading');
      const swaggerDoc = await client?.openapi().getApiDocs('v3') as OpenAPIV3.Document;
      dispatch(setOpenApiDocs(swaggerDoc));
      const appInfo = await client?.info().getAppInfo();
      if (!_isNil(appInfo)) {
        dispatch(setAppInfo(appInfo));
      }
      if (appInfo?.userId) {
        const userInfo = await client?.user().findOne(appInfo.userId);
        if (!_isNil(userInfo)) {
          dispatch(setUserInfo(userInfo));
        }
      }
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
      Logger.error(error);
    }
  }, [dispatch, client]);

  const executeWfsDescribeFeatureType = useExecuteWfsDescribeFeatureType();

  const getPropertyNames = useCallback(async (layerId: number | null) => {
    let response: DescribeFeatureType | undefined;
    const propNames: string[] = [];
    if (layerSuggestionList && layerId) {
      const layer = layerSuggestionList.filter(item => item.id === layerId)[0];
      if (layer) {
        try {
          response = await executeWfsDescribeFeatureType(layer);
          if (response !== undefined) {
            response.featureTypes[0].properties.forEach(prop => {
              propNames.push(prop.name);
            });
          }
        } catch (error) {
          Logger.error(error);
          propNames[0] = '';
        }
      }
    }
    return propNames;
  }, [executeWfsDescribeFeatureType, layerSuggestionList]);

  const registerCompletionProvider = useCallback(() => {
    if (!monaco) {
      return undefined;
    }

    disposableCompletionItemProviderRef.current = monaco.languages.registerCompletionItemProvider('json', {
      triggerCharacters: ['.'],
      provideCompletionItems: async (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber).trim();

        if (lineContent.startsWith('"layerId"')) {
          const currentWord = model.getWordAtPosition(position);
          const providerResult: ProviderResult<CompletionList> = {
            suggestions: layerSuggestionList.map((layer): CompletionItem => {
              return {
                insertText: layer?.id?.toString() ?? '',
                label: `${layer.name} (${layer.id})`,
                kind: monaco.languages.CompletionItemKind.Value,
                documentation: `${JSON.stringify(layer, null, '  ')}`,
                range: {
                  // replace the current word, if applicable
                  startColumn: currentWord ? currentWord.startColumn : position.column,
                  endColumn: currentWord ? currentWord.endColumn : position.column,
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                }
              };
            })
          };

          return providerResult;
        }

        if (lineContent.startsWith('"propertyName"')) {
          const currentWord = model.getWordAtPosition(position);
          const providerResult: ProviderResult<CompletionList> = {
            suggestions: propertyNames.map((prop): CompletionItem => {
              return {
                insertText: `"${prop}"`,
                label: prop,
                kind: monaco.languages.CompletionItemKind.Value,
                documentation: `${JSON.stringify(prop, null, '  ')}`,
                range: {
                  // replace the current word, if applicable
                  startColumn: currentWord ? currentWord.startColumn : position.column,
                  endColumn: currentWord ? currentWord.endColumn : position.column,
                  startLineNumber: position.lineNumber,
                  endLineNumber: position.lineNumber,
                }
              };
            })
          };
          return providerResult;
        }
      }
    });
  }, [monaco, layerSuggestionList, propertyNames]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  useEffect(() => {
    const propName = async() => {
      const properties = await getPropertyNames(entityId);
      setPropertyNames(properties);
    };
    propName();
  }, [entityId, getPropertyNames]);

  useEffect(() => {
    registerCompletionProvider();

    return () => {
      if (disposableCompletionItemProviderRef.current) {
        disposableCompletionItemProviderRef.current.dispose();
      }
    };
  }, [registerCompletionProvider]);

  if (loadingState === 'loading') {
    return (
      <Result
        className="result-spin"
        icon={<ShogunSpinner />}
      />
    );
  }
  if (loadingState === 'failed') {
    return (
      <Result
        status="warning"
        title={t('App.loadFail')}
      />
    );
  }

  return (
    <ConfigProvider
      theme={{
        cssVar: true
      }}
    >
      <AntdApp>
        <div className='app'>
          <Router>
            <Header />
            <React.Suspense
              fallback={
                <Spin
                  className="suspense-spin"
                  indicator={
                    <ShogunSpinner />
                  }
                />
              }
            >
              <Routes>
                <Route
                  path={`${config.appPrefix}/portal/*`}
                  element={<Portal />}
                />
                <Route
                  path={`${config.appPrefix}/`}
                  element={<Navigate to={`${config.appPrefix}/portal`} />}
                />
              </Routes>
            </React.Suspense>
          </Router>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
