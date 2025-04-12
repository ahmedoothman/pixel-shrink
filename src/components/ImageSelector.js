import React from 'react';
import { Button, List, Empty, Typography, Badge, Tooltip } from 'antd';
import {
  FolderOpenOutlined,
  FileImageOutlined,
  PictureOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

function ImageSelector({
  selectedFiles,
  onSelectFiles,
  destination,
  onSelectDestination,
}) {
  return (
    <div className='p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700'>
      <div className='flex justify-between items-center mb-6'>
        <Title level={4} className='m-0' style={{ color: 'white' }}>
          Select Images
        </Title>
        <Badge count={selectedFiles.length} showZero color='#1890ff' />
      </div>

      <div className='grid grid-cols-2 gap-2 mb-6 '>
        <Button
          type='primary'
          size='large'
          onClick={onSelectFiles}
          className='flex items-center justify-center'
        >
          <div className='flex items-center'>
            <FileImageOutlined className='mr-1' style={{ fontSize: '16px' }} />
            <span>Browse Images</span>
          </div>
        </Button>

        <Button
          type='default'
          size='large'
          onClick={onSelectDestination}
          className='flex items-center justify-center'
        >
          <div className='flex items-center'>
            <FolderOpenOutlined className='mr-1' style={{ fontSize: '16px' }} />
            <span className='align-middle'>Set Destination</span>
          </div>
        </Button>
      </div>

      {destination && (
        <div className='mb-6 p-4 bg-gray-700 border border-gray-600 rounded-md flex items-start'>
          <div className='flex-grow'>
            <Text strong style={{ color: 'white' }}>
              Output Directory:
            </Text>
            <Text className='block mt-1' style={{ color: 'white' }}>
              {destination}
            </Text>
          </div>
          <CheckCircleOutlined className='text-green-500 ml-2 text-lg' />
        </div>
      )}

      <div className='border border-gray-700 rounded-md overflow-hidden'>
        <div className='bg-gray-700 p-3 border-b border-gray-600 flex justify-between items-center'>
          <Text strong style={{ color: 'white' }} className='flex items-center'>
            <PictureOutlined className='mr-2 text-blue-400' />
            Selected Images
          </Text>
          <Tooltip title='Files will be processed in the order shown'>
            <InfoCircleOutlined className='text-gray-400' />
          </Tooltip>
        </div>

        {selectedFiles.length > 0 ? (
          <List
            size='small'
            dataSource={selectedFiles}
            className='max-h-72 overflow-y-auto bg-gray-800'
            renderItem={(file, index) => (
              <List.Item className='px-4 py-3 hover:bg-gray-700 border-b border-gray-700 flex items-center'>
                <div className='w-6 mr-2' style={{ color: '#a0aec0' }}>
                  {index + 1}
                </div>
                <div className='flex-grow'>
                  <Text style={{ color: 'white' }} className='font-medium'>
                    {file.name}
                  </Text>
                  {file.size && (
                    <Text
                      style={{ color: '#cbd5e0' }}
                      className='block text-xs'
                    >
                      {(file.size / 1024).toFixed(1)} KB
                    </Text>
                  )}
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className='text-center p-4'>
                <Text style={{ color: 'white' }} className='block mb-2'>
                  No images selected
                </Text>
                <Text style={{ color: '#cbd5e0' }} className='text-xs'>
                  Click "Browse Images" to select files
                </Text>
              </div>
            }
            className='my-8 bg-gray-800'
          />
        )}
      </div>
    </div>
  );
}

export default ImageSelector;
