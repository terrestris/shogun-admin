import React from 'react';

import {
  SearchOutlined
} from '@ant-design/icons';

import { Input, Button } from 'antd';

export default class TableUtil {

  public static getColumnSearchProps = (dataIndex: string | string[], handleSearch, handleReset) => {
    let searchInput;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => { searchInput = node; }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Filter
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
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
          .toString()
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
}
