import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import {
  useRecoilState
} from 'recoil';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';

import {
  useTranslation
} from 'react-i18next';

import {
  OpenAPIV3
} from 'openapi-types';

import {
  useMonaco
} from '@monaco-editor/react';

import {
  IDisposable
} from 'monaco-editor';

import {
  Result,
  Spin
} from 'antd';

import {
  LoadingOutlined
} from '@ant-design/icons';

import Logger from 'js-logger';

import _isEmpty from 'lodash/isEmpty';

import Header from './Component/Header/Header';
import Portal from './Page/Portal/Portal';
import {
  appInfoAtom,
  userInfoAtom,
  layerSuggestionListAtom
} from './State/atoms';
import {
  setSwaggerDocs
} from './State/static';

import useSHOGunAPIClient from './Hooks/useSHOGunAPIClient';

import config from 'shogunApplicationConfig';

const App: React.FC = () => {
  const [, setUserInfo] = useRecoilState(userInfoAtom);
  const [, setAppInfo] = useRecoilState(appInfoAtom);
  const [layerSuggestionList, setLayerSuggestionList] = useRecoilState(layerSuggestionListAtom);
  const [loadingState, setLoadingState] = useState<'failed' | 'loading' | 'done'>();

  const disposableCompletionItemProviderRef = useRef<IDisposable>();

  const client = useSHOGunAPIClient();

  const monaco = useMonaco();

  // Fetch initial data:
  // - swagger docs
  // - applicationInfo
  // - logged in User
  const {
    t
  } = useTranslation();

  const getInitialData = useCallback(async () => {
    try {
      setLoadingState('loading');
      const swaggerDoc = await client.openapi().getApiDocs('v3') as OpenAPIV3.Document;
      setSwaggerDocs(swaggerDoc);
      const appInfo = await client.info().getAppInfo();
      setAppInfo(appInfo);
      if (appInfo?.userId) {
        const userInfo = await client.user().findOne(appInfo.userId);
        setUserInfo(userInfo);
      }
      setLoadingState('done');
    } catch (error) {
      setLoadingState('failed');
      Logger.error(error);
    }
  }, [setAppInfo, setUserInfo, client]);

  const registerLayerIdCompletionProvider = useCallback(() => {
    if (!monaco) {
      return undefined;
    }

    const disposableCompletionItemProvider = monaco.languages.registerCompletionItemProvider('json', {
      triggerCharacters: ['.'],
      provideCompletionItems: async (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber).trim();

        if (!lineContent.startsWith('\"layerId\"')) {
          return null;
        }

        if (!layerSuggestionList) {
          try {
            const layers = await client.layer().findAll();

            setLayerSuggestionList(layers);

            if (disposableCompletionItemProviderRef.current) {
              disposableCompletionItemProviderRef.current.dispose();
            }
          } catch (error) {
            Logger.error(error);
          } finally {
            return null;
          }
        }

        return {
          suggestions: layerSuggestionList.map(layer => ({
            insertText: layer.id.toString(),
            label: `${layer.name} (${layer.id})`,
            kind: monaco.languages.CompletionItemKind.Value,
            documentation: `${JSON.stringify(layer, null, '  ')}`,
            range: null
          }))
        };
      }
    });

    disposableCompletionItemProviderRef.current = disposableCompletionItemProvider;
  }, [monaco, client, setLayerSuggestionList, layerSuggestionList]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  useEffect(() => {
    registerLayerIdCompletionProvider();

    return () => {
      if (disposableCompletionItemProviderRef.current) {
        disposableCompletionItemProviderRef.current.dispose();
      }
    };
  }, [registerLayerIdCompletionProvider]);

  if (loadingState === 'loading') {
    return (
      <Result
        icon={<LoadingOutlined spin />}
        title={t('App.loading')}
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
    <Router>
      <Header />
      <React.Suspense
        fallback={
          <Spin
            className="suspense-spin"
            indicator={
              <LoadingOutlined
                className="suspense-spin-icon"
                spin
              />
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
  );
};

export default App;
