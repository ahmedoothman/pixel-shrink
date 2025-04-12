import React from 'react';
import { Table, Empty, Alert, Progress, Typography } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Text } = Typography;

function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function ImagePreview({ selectedFiles, results }) {
  const columns = [
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <span className={record.success ? 'text-green-500' : 'text-red-500'}>
          {record.success ? (
            <CheckCircleOutlined className='mr-1' />
          ) : (
            <WarningOutlined className='mr-1' />
          )}
          {record.success ? 'Success' : 'Failed'}
        </span>
      ),
    },
    {
      title: 'Original Size',
      key: 'originalSize',
      render: (_, record) =>
        record.originalSize ? formatSize(record.originalSize) : '-',
    },
    {
      title: 'Compressed Size',
      key: 'compressedSize',
      render: (_, record) =>
        record.compressedSize ? formatSize(record.compressedSize) : '-',
    },
    {
      title: 'Savings',
      key: 'savings',
      render: (_, record) => {
        if (!record.success || !record.savingsPercent) return '-';
        const savingsPercent = parseFloat(record.savingsPercent);
        return (
          <div className='flex items-center'>
            <Progress
              percent={savingsPercent}
              size='small'
              className='w-24 mr-2'
              strokeColor={savingsPercent > 50 ? '#52c41a' : '#1890ff'}
            />
            <Text>{savingsPercent}%</Text>
          </div>
        );
      },
    },
  ];

  if (selectedFiles.length === 0) {
    return (
      <Empty
        description='Select images to begin'
        className='my-16 h-full flex items-center justify-center font-medium'
      />
    );
  }

  if (results.length === 0) {
    return (
      <div>
        <Alert
          message='Ready to compress'
          description={`${selectedFiles.length} image${
            selectedFiles.length > 1 ? 's' : ''
          } selected. Configure options and press Compress to begin.`}
          type='info'
          showIcon
          className='mb-4'
        />

        <Table
          dataSource={selectedFiles.map((f) => ({ key: f.path, file: f.name }))}
          columns={columns.slice(0, 1)}
          pagination={false}
          className='mt-4'
        />
      </div>
    );
  }

  const totalOriginal = results.reduce(
    (sum, r) => sum + (r.originalSize || 0),
    0
  );
  const totalCompressed = results.reduce(
    (sum, r) => sum + (r.compressedSize || 0),
    0
  );
  const totalSavings =
    totalOriginal > 0
      ? (((totalOriginal - totalCompressed) / totalOriginal) * 100).toFixed(2)
      : 0;

  return (
    <div>
      <Alert
        message='Compression Complete'
        description={
          <div>
            <div>
              {results.filter((r) => r.success).length} of {results.length}{' '}
              images compressed successfully.
            </div>
            <div className='mt-2'>
              <Text strong>Total Savings: </Text>
              <Text>
                {formatSize(totalOriginal - totalCompressed)} ({totalSavings}%)
              </Text>
            </div>
          </div>
        }
        type='success'
        showIcon
        className='mb-4'
      />

      <Table
        dataSource={results.map((r, i) => ({ ...r, key: i }))}
        columns={columns}
        pagination={false}
      />
    </div>
  );
}

export default ImagePreview;
