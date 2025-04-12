import React from 'react';
import { Empty, Progress, Typography } from 'antd';
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
        <div className='mb-4 flex items-start p-4 border border-blue-300 bg-blue-50 rounded-md'>
          <div className='flex'>
            <div className='flex-shrink-0 text-blue-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800'>
                Ready to compress
              </h3>
              <div className='mt-2 text-sm text-blue-700'>
                {`${selectedFiles.length} image${
                  selectedFiles.length > 1 ? 's' : ''
                } selected. Configure options and press Compress to begin.`}
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
          <table className='min-w-full divide-y divide-gray-300'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'
                >
                  File
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {selectedFiles.map((f) => (
                <tr key={f.path}>
                  <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900'>
                    {f.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <div className='mb-4 flex items-start p-4 border border-green-300 bg-green-50 rounded-md'>
        <div className='flex'>
          <div className='flex-shrink-0 text-green-500'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='ml-3'>
            <h3 className='text-sm font-medium text-green-800'>
              Compression Complete
            </h3>
            <div className='mt-2 text-sm text-green-700'>
              <div>
                {results.filter((r) => r.success).length} of {results.length}{' '}
                images compressed successfully.
              </div>
              <div className='mt-2'>
                <Text strong>Total Savings: </Text>
                <Text>
                  {formatSize(totalOriginal - totalCompressed)} ({totalSavings}
                  %)
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg'>
        <table className='min-w-full divide-y divide-gray-300'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'
              >
                File
              </th>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'
              >
                Status
              </th>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'
              >
                Original Size
              </th>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'
              >
                Compressed Size
              </th>
              <th
                scope='col'
                className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900'
              >
                Savings
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200 bg-white'>
            {results.map((r, i) => (
              <tr key={i}>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900'>
                  {r.file}
                </td>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900'>
                  <span
                    className={r.success ? 'text-green-500' : 'text-red-500'}
                  >
                    {r.success ? (
                      <CheckCircleOutlined className='mr-1' />
                    ) : (
                      <WarningOutlined className='mr-1' />
                    )}
                    {r.success ? 'Success' : 'Failed'}
                  </span>
                </td>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900'>
                  {r.originalSize ? formatSize(r.originalSize) : '-'}
                </td>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900'>
                  {r.compressedSize ? formatSize(r.compressedSize) : '-'}
                </td>
                <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900'>
                  {r.success && r.savingsPercent ? (
                    <div className='flex items-center'>
                      <Progress
                        percent={parseFloat(r.savingsPercent)}
                        size='small'
                        className='w-24 mr-2'
                        strokeColor={
                          parseFloat(r.savingsPercent) > 50
                            ? '#52c41a'
                            : '#1890ff'
                        }
                      />
                      <Text>{parseFloat(r.savingsPercent)}%</Text>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ImagePreview;
