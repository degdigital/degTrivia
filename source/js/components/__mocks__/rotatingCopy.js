function start() {}

const rotatingCopy = jest.fn();
rotatingCopy.mockImplementation(el => {
    return {
        start
    }
})

export default rotatingCopy;