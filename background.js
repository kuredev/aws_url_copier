chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) return;

  const awsUrl = normalizeAwsUrl(tab.url);
  if (awsUrl) {
    copyToClipboard(awsUrl, tab.id);
  } else {
    alert("This extension only works on AWS Management Console pages.");
  }
});

function normalizeAwsUrl(url) {
  const awsPattern = /^(https:\/\/)([a-z0-9-]+\.)?([a-z0-9-]+)\.console\.aws\.amazon\.com(\/.*)?$/;
  const match = url.match(awsPattern);

  if (!match) return null; // AWSコンソールのURLでなければ処理しない

  let baseUrl = match[1] + match[3] + ".console.aws.amazon.com" + (match[4] || "");
  return baseUrl;
}

function copyToClipboard(text, tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert("Copied!");
      }).catch(err => console.error("Copy Failed", err));
    },
    args: [text]
  });
}
