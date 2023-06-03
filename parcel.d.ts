declare module 'bundle-text:*' {
    const value: string;
    export default value;
}

declare module '*.scss' {
    const styles: { [className: string]: string };
    export default styles;
}
