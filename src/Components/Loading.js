import React from 'react'
import { Alert, Space, Spin } from 'antd';

const Loading = () => {
  return (
    <div className='loadi'>
      <Spin size="large">
        <div className="content" />
      </Spin>
    </div>
  )
}

export default Loading