const main = () => {
  let jsonData;
  
  try {
    const pre = document.querySelector('pre');
    if (pre) {
      jsonData = JSON.parse(pre.textContent);
    } else {
      jsonData = JSON.parse(document.body.textContent);
    }
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return;
  }

  window.postMessage({ type: 'FROM_PAGE', jsonData: jsonData }, '*');
}

main();
