import React, { useState } from 'react';
import { Layout, message, ConfigProvider } from 'antd';
import ImageSelector from './components/ImageSelector';
import CompressionOptions from './components/CompressionOptions';
import ImagePreview from './components/ImagePreview';
// Remove the problematic CSS import
// import 'antd/dist/antd.css';
import './App.css';

const { Content, Sider } = Layout;
const { ipcRenderer } = window.require('electron');

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [destination, setDestination] = useState('');
  const [options, setOptions] = useState({
    quality: 80,
    width: 1200,
    height: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);

  const handleSelectFiles = async () => {
    const files = await ipcRenderer.invoke('select-files');
    if (files.length > 0) {
      setSelectedFiles(
        files.map((file) => ({
          path: file,
          name: file.split(/[\\/]/).pop(),
        }))
      );
    }
  };

  const handleSelectDestination = async () => {
    const dir = await ipcRenderer.invoke('select-destination');
    if (dir) {
      setDestination(dir);
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setResults([]);
    // Optionally uncomment the next line if you want to reset the destination too
    // setDestination('');
    message.info('Reset complete');
  };

  const handleCompress = async () => {
    if (selectedFiles.length === 0) {
      message.error('Please select images to compress');
      return;
    }

    if (!destination) {
      message.error('Please select a destination folder');
      return;
    }

    setProcessing(true);
    try {
      const compressionResults = await ipcRenderer.invoke('compress-images', {
        files: selectedFiles.map((f) => f.path),
        destination,
        options,
      });

      setResults(compressionResults);
      message.success(
        `Compressed ${compressionResults.filter((r) => r.success).length} of ${
          compressionResults.length
        } images`
      );
    } catch (error) {
      message.error(`Error compressing images: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ConfigProvider>
      <Layout className='min-h-screen'>
        <Sider width={400} className='bg-gray-800 p-4' theme='dark'>
          <div className='text-white text-xl font-bold mb-6'>Pixel Shrink</div>
          <ImageSelector
            selectedFiles={selectedFiles}
            onSelectFiles={handleSelectFiles}
            destination={destination}
            onSelectDestination={handleSelectDestination}
            onReset={results.length > 0 ? handleReset : null}
          />
          <CompressionOptions
            options={options}
            onChange={setOptions}
            onCompress={handleCompress}
            processing={processing}
            showReset={results.length > 0}
            onReset={handleReset}
          />
        </Sider>
        <Layout className='site-layout'>
          <Content className='m-4 p-4 bg-white rounded-lg'>
            <ImagePreview selectedFiles={selectedFiles} results={results} />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
export default App;
