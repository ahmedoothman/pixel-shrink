import React from 'react';
import { Button, Slider, Form, Divider } from 'antd';
import { CompressOutlined, ReloadOutlined } from '@ant-design/icons';

function CompressionOptions({
  options,
  onChange,
  onCompress,
  processing,
  showReset,
  onReset,
}) {
  const qualityMarks = {
    10: {
      label: <span style={{ fontSize: '12px', color: 'white' }}>Low</span>,
    },
    50: {
      label: <span style={{ fontSize: '12px', color: 'white' }}>Med</span>,
    },
    90: {
      label: <span style={{ fontSize: '12px', color: 'white' }}>High</span>,
    },
  };

  const handleChange = (field, value) => {
    onChange({ ...options, [field]: value });
  };

  const getQualityDescription = (quality) => {
    if (quality < 40) return 'Low quality, significant file size reduction';
    if (quality < 70) return 'Medium quality, good file size reduction';
    if (quality < 85) return 'Good quality, moderate file size reduction';
    return 'High quality, minimal file size reduction';
  };

  return (
    <div className='mb-6 mt-6'>
      <div
        style={{
          color: 'white',
          padding: '0 0 10px 0',
          fontSize: '18px',
          fontWeight: '600',
        }}
      >
        Compression Options
      </div>

      <Form
        layout='vertical'
        style={{
          background: '#1e2937',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Form.Item
          label={
            <span
              style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}
            >
              Quality
            </span>
          }
          help={
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>
              {getQualityDescription(options.quality)}
            </span>
          }
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <Slider
              min={10}
              max={100}
              marks={qualityMarks}
              value={options.quality}
              onChange={(value) => handleChange('quality', value)}
              style={{ flex: 1, marginRight: '15px' }}
              styles={{
                track: { backgroundColor: '#f56565' },
                handle: { borderColor: '#f56565', backgroundColor: '#f56565' },
              }}
            />
            <input
              type='number'
              min={10}
              max={100}
              value={options.quality || 80}
              onChange={(e) => {
                const value =
                  e.target.value === '' ? 10 : Number(e.target.value);
                if (value <= 100 && value >= 10) {
                  handleChange('quality', value);
                }
              }}
              style={{
                width: '60px',
                backgroundColor: '#374151',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #4b5563',
                outline: 'none',
                fontSize: '14px',
                textAlign: 'center',
              }}
            />
          </div>
        </Form.Item>

        <Divider style={{ margin: '10px 0', borderColor: '#4b5563' }} />

        <Form.Item
          label={
            <span
              style={{ color: '#e5e7eb', fontSize: '15px', fontWeight: 500 }}
            >
              Resize to
            </span>
          }
          style={{ marginBottom: '10px' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <span style={{ color: '#d1d5db', fontSize: '13px', width: '50px' }}>
              Width:
            </span>
            <input
              type='number'
              min={0}
              max={10000}
              value={options.width || ''}
              onChange={(e) => {
                const value =
                  e.target.value === '' ? 0 : Number(e.target.value);
                if (value <= 10000 && value >= 0) {
                  handleChange('width', value);
                }
              }}
              placeholder='Width (px)'
              style={{
                flex: 1,
                backgroundColor: '#374151',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #4b5563',
                outline: 'none',
                fontSize: '14px',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#d1d5db', fontSize: '13px', width: '50px' }}>
              Height:
            </span>
            <input
              type='number'
              min={0}
              max={10000}
              value={options.height || ''}
              onChange={(e) => {
                const value =
                  e.target.value === '' ? 0 : Number(e.target.value);
                if (value <= 10000 && value >= 0) {
                  handleChange('height', value);
                }
              }}
              placeholder='Height (px)'
              style={{
                flex: 1,
                backgroundColor: '#374151',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #4b5563',
                outline: 'none',
                fontSize: '14px',
              }}
            />
            <span
              style={{ color: '#9ca3af', marginLeft: '10px', fontSize: '12px' }}
            >
              (0 = auto)
            </span>
          </div>
        </Form.Item>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <Button
            type='primary'
            danger
            onClick={onCompress}
            loading={processing}
            style={{
              flex: '1',
              height: '40px',
              borderRadius: '6px',
              backgroundColor: '#f56565',
              borderColor: '#f56565',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CompressOutlined
                style={{ fontSize: '16px', marginRight: '8px' }}
              />
              <span style={{ fontSize: '14px' }}>
                {processing ? 'Compressing...' : 'Compress Images'}
              </span>
            </div>
          </Button>

          {showReset && (
            <Button
              onClick={onReset}
              style={{
                width: '100px',
                height: '40px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReloadOutlined style={{ marginRight: '6px' }} />
              <span>Reset</span>
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}

export default CompressionOptions;
