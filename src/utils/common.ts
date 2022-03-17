export function throttle(fn: Function, delay: number) {
  let flag = false;
  return () => {
    if (flag) return;
    flag = true;
    setTimeout(() => {
      fn(...arguments);
      flag = false;
    }, delay);
  };
}
