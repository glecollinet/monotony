export const someAsyncAction = (duration, id) => (dispatch, getState) => {
	return new Promise((resolve, reject) => {
		console.log('DURATION ', duration, id);

		setTimeout(resolve, duration || 1000);
	})
};