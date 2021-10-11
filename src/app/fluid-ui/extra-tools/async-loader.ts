export function asyncLoadScript(url: string) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.onload = function () {
      resolve(url);
    };

    script.src = url;

    document.head.appendChild(script);
  });
}

export function asyncLoadCss(url: string) {


  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;

    link.onload = () => {
      resolve(url);
    };

    document.head.appendChild(link);
  });
}
