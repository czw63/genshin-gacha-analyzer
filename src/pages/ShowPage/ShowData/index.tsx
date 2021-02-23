/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Tabs } from 'antd';
import UpOutlined from '@ant-design/icons/UpOutlined';
import DownOutlined from '@ant-design/icons/DownOutlined';
import { SCHEMA, SCHEMA_ALL, SHOW_DATA_ALL_KEY } from 'const';
import { WorkSheet } from 'components/WorkSheet';
import { Filter } from './Filter';
import { IconButton } from 'components/IconButton';

type ShowDataProps = {
  onGetData: (key: string) => any;
  tabs: Array<string>;
};
const { TabPane } = Tabs;

export const ShowData: FC<ShowDataProps> = function ({ onGetData, tabs }) {
  const [activeKey, setActiveKey] = useState(tabs[0]);
  const handleChange = useCallback((key) => {
    setActiveKey(key);
  }, []);
  // filter为函数，因此不能直接使用useState，为了页面能更新，不使用ref
  const [filter, setFilter] = useState<{
    current: any;
  }>({
    current: void 0,
  });
  const handleFilterChange = useCallback((filter) => {
    setFilter({
      current: filter,
    });
  }, []);
  const data = useMemo(() => {
    const data = onGetData(activeKey);
    if (!filter.current) return data;
    return data.filter(filter.current);
  }, [filter.current, activeKey]);
  const canvasDataRef = useRef();
  const handleCreateWorkSheet = useCallback((node) => {
    canvasDataRef.current = node;
  }, []);
  const handleGoTop = useCallback(() => {
    if (canvasDataRef.current) (canvasDataRef.current as any).scrollTop = 0;
  }, []);
  const handleGoBottom = useCallback(() => {
    const node: any = canvasDataRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, []);
  return (
    <div
      css={css`
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      `}
    >
      <Tabs
        activeKey={activeKey}
        onChange={handleChange}
        size='large'
        centered
        css={css`
          .ant-tabs-nav {
            background: #fff;
            height: 64px;
          }
        `}
      >
        {tabs.map((name: string) => (
          <TabPane tab={name} key={name} />
        ))}
        <TabPane tab={SHOW_DATA_ALL_KEY} key={SHOW_DATA_ALL_KEY} />
        <Filter onChange={handleFilterChange} activeKey={activeKey} />
      </Tabs>
      <div
        css={css`
          position: absolute;
          right: 10%;
          z-index: 999;
          top: 72px;
        `}
      >
        <IconButton placement='right' tip='前往顶部' icon={<UpOutlined />} onClick={handleGoTop} />
        <br />
        <IconButton
          placement='right'
          tip='前往底部'
          icon={<DownOutlined />}
          onClick={handleGoBottom}
        />
      </div>
      <WorkSheet
        data={data}
        schema={activeKey === SHOW_DATA_ALL_KEY ? SCHEMA_ALL : SCHEMA}
        onCreate={handleCreateWorkSheet}
      />
    </div>
  );
};
