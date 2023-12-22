import React from 'react';

import {
  SearchOutlined
} from '@ant-design/icons';
import { Button, Input, InputRef } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _isNil from 'lodash/isNil';

import i18n from '../i18n';

export default class TableUtil {

  public static getColumnSearchProps<T>(
    dataIndex: string | string[],
    handleSearch = TableUtil.handleSearch,
    handleReset =  TableUtil.handleReset
  ){
    let searchInput: InputRef | null;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
        <div
          style={{
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch'
          }}
        >
          <Input
            ref={node => { searchInput = node; }}
            placeholder={`${i18n.t('GeneralEntityTable.popupSearch')} ${dataIndex}`}
            value={(selectedKeys.length === 0 || _isNil(selectedKeys[0])) ? '' : `${selectedKeys[0]}`}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{
              flex: 1,
              marginBottom: 8,
            }}
          />
          <div style={{display: 'flex'}}>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                flex: 1,
                marginRight: 8
              }}
            >
              {`${i18n.t('GeneralEntityTable.popupFilter')}`}
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ flex: 1 }}>
              {`${i18n.t('GeneralEntityTable.popupReset')}`}
            </Button>
          </div>
        </div>
      ),
      filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value: string | number | boolean, record: T) => {
        let recVal: any;
        if (Array.isArray(dataIndex)) {
          let a: any;
          dataIndex.forEach((key, i) => i === 0 ? a = _get(record, key) : a = _get(a, key));
          recVal = a;
        } else {
          recVal = _get(record, dataIndex);
        }
        return `${recVal}`
          .toLowerCase()
          .includes(`${value}`.toLowerCase());
      },
      onFilterDropdownVisibleChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput?.select());
        }
      }
    };
  };

  public static getSorter<T>(dataIndex: string){
    return (a: T, b: T) => {
      const valA: string = _get(a, dataIndex)?.toString();
      const valB: string = _get(b, dataIndex)?.toString();
      return valA?.localeCompare(valB, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    };
  };

  public static handleSearch = (
    selectedKeys: React.Key[],
    confirm?: (param?: FilterConfirmProps | undefined) => void
  ) => {
    if (_isFunction(confirm)) {
      confirm();
    }
  };

  public static handleReset = (clearFilters?: () => void) => {
    if (_isFunction(clearFilters)) {
      clearFilters();
    }
  };

}
