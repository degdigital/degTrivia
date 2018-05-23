const classnames = jest.fn(((type, config) => {
    const classNames = Object.keys(config);
    return classNames.map(className => config[className]).join(' ');
}));

export default classnames;