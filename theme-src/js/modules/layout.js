/**
 * This is the main Layout
 */
class Layout {
	/**
	 * Constructor for layout class
	 * @param {string[]} this.consoleLogStatement is a string of text to be console.logged to verify that the js is working correctly
	 */
	constructor() {
		this.consoleLogStatement = 'Yup, it works!'
	}

	/**
	 * Initial method that runs when the class is first instantiated
	 */
	init() {
		this.consoleLogTest();
	}

	/**
	 * consoleLogTest is a method that simple prints out a variable to the console
	 */
	consoleLogTest() {
		console.log(this.consoleLogStatement);
	}
}

export default Layout;
