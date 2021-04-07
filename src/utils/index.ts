function truncate(str: string | number, num: number) {
  if ((str && str.length <= num) || typeof str === "number" || !str) {
    return str;
  }
  return str.slice(0, num) + "...";
}

export { truncate };
