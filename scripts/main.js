// script.js

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('whoisForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const domainInput = document.getElementById('domain').value;
    fetchWhoisInfo(domainInput);
  });
});

function validateInput(domain) {
  // 检查支持的顶级域名列表
  const supportedSuffixes = ['com', 'net', 'org', 'me', 'xyz', 'info', 'io', 'co', 'ai', 'biz', 'us'];
  // 只抽取域名最后两个部分来确定 name 和 suffix
  const parts = domain.split('.').slice(-2);
  if (parts.length === 2 && supportedSuffixes.includes(parts[1])) {
    return { name: parts[0], suffix: parts[1] };
  } else {
    return null;
  }
}

function fetchWhoisInfo(domain) {
  const validation = validateInput(domain);
  if (validation) {
    const url = `/whois-proxy/?name=${validation.name}&suffix=${validation.suffix}`;

    showLoading();
    displayError(''); // 清空之前的错误信息

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
    displayError('请输入有效的域名。');
  }
}

function displayResults(data) {
  const resultsContainer = document.getElementById('results');
  
  // 提取感兴趣的信息
  const availability = data.available ? '可用' : '不可用';
  const registrar = extractValue(data.info, 'Registrar');
  const creationDate = extractValue(data.info, 'Creation Date');
  const expiryDate = extractValue(data.info, 'Registry Expiry Date');
  const domainStatus = extractValue(data.info, 'Domain Status');

  // 格式化显示信息
  const formattedInfo = `
    <strong>可用性:</strong> ${availability}<br>
    <strong>注册商:</strong> ${registrar}<br>
    <strong>注册日期:</strong> ${creationDate}<br>
    <strong>过期日期:</strong> ${expiryDate}<br>
    <strong>域名状态:</strong> ${domainStatus}
  `;

  // 显示格式化的信息
  resultsContainer.innerHTML = formattedInfo;
}

// 从 WHOIS 数据中提取特定字段的值
function extractValue(whoisData, fieldName) {
  const match = whoisData.match(new RegExp(`${fieldName}:\\s*([^\r\n]+)`));
  return match ? match[1].trim() : 'N/A';
}

function showLoading() {
  document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

function displayError(message) {
  const errorContainer = document.getElementById('error');
  errorContainer.textContent = message;
}
