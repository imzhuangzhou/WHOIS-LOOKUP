// script.js

function validateInput(domain) {
    const supportedSuffixes = ['com', 'net', 'org', 'me', 'xyz', 'info', 'io', 'co', 'ai', 'biz', 'us'];
    const parts = domain.split('.').slice(-2);
    return (parts.length === 2 && supportedSuffixes.includes(parts[1])) ? { name: parts[0], suffix: parts[1] } : null;
  }
  
  function fetchWhoisInfo(domain) {
    const validation = validateInput(domain);
    if (validation) {
      const url = `/whois-proxy/?name=${validation.name}&suffix=${validation.suffix}`;
  
      showLoading();
  
      // 清空之前的错误信息
      displayError('');
  
      fetch(url)
        .then(response => {
          hideLoading();
          if (!response.ok) {
            throw new Error(`网络请求失败: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          displayResults(data);
        })
        .catch(error => {
          displayError(`发生错误: ${error.message}`);
        });
    } else {
      // 清空之前的错误信息
      displayError('请输入有效的域名。');
    }
  }
  
  
  function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = JSON.stringify(data, null, 2);
  }
  
  function displayError(message) {
    const errorContainer = document.getElementById('error');
    errorContainer.textContent = message;
  }
  
  function showLoading() {
    document.getElementById('loading').style.display = 'block';
  }
  
  function hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('whoisForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const domainInput = document.getElementById('domain').value;
      fetchWhoisInfo(domainInput);
    });
  });
  