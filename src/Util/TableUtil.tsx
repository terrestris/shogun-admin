import React from 'react';

import {
  SearchOutlined
} from '@ant-design/icons';

import i18n from '../i18n';
import { Input, Button } from 'antd';

export default class TableUtil {

  public static getColumnSearchProps = (
    dataIndex: string | string[],
    handleSearch = TableUtil.handleSearch,
    handleReset =  TableUtil.handleReset
  ) => {
    let searchInput;
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              flex: 1,
              marginBottom: 8,
            }}
          />
          <div style={{display: 'flex'}}>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) => {
        let recVal: string;
        if (Array.isArray(dataIndex)) {
          let a;
          dataIndex.forEach((key, i) => i === 0 ? a = record[key] : a = a[key]);
          recVal = a;
        } else {
          recVal = record[dataIndex];
        }
        return recVal
          ?.toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      },
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.select());
        }
      }
    };
  };

  public static getSorter = (dataIndex: string) => {
    return (a, b) => {
      const valA: string = a[dataIndex]?.toString();
      const valB: string = b[dataIndex]?.toString();
      return valA?.localeCompare(valB, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    };
  };

  public static handleSearch = (selectedKeys, confirm, dataIndex?) => {
    confirm();
  };

  public static  handleReset = clearFilters => {
    clearFilters();
  };
}
