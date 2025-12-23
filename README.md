# YouTube Automated Test Suite 

![Selenium](https://img.shields.io/badge/-Selenium-43B02A?style=for-the-badge&logo=selenium&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Mocha](https://img.shields.io/badge/-Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/-Chai-A30701?style=for-the-badge&logo=chai&logoColor=white)

## Overview

This project is an automated testing suite for YouTube using **Selenium WebDriver**, **Mocha**, and **Chai**. It performs end-to-end testing of search functionality, content verification, and UI element validation (thumbnails).

The suite is designed to verify that specific video content related to "Sustainable Industry Technology 5.0" and "Green University of Bangladesh" appears correctly in search results.

## 🛠️ Prerequisites

Before running the tests, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Google Chrome](https://www.google.com/chrome/) browser
- Internet connection (for accessing YouTube)

## Installation

1.  **Clone the repository** (or download the source code):
    ```bash
    git clone <repository-url>
    cd CLP
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Running the Tests

To execute the test suite, run the following command in your terminal:

```bash
npm test
```

This command runs the `mocha` test runner with the `mochawesome` reporter as defined in `package.json`.

## Test Scenarios

The suite (`test_suite.js`) covers the following scenarios:

1.  ** Search Functionality**:
    - Navigates to YouTube.
    - Handles cookie consent popups (if present).
    - Searches for the query: `"Sustainable Industry Technology 5.0"`.
    - Verifies that video results are loaded (infinite scroll handling included).

2.  ** Content Verification**:
    - Scrolls through the search results.
    - Verifies the presence of a video related to **"Green University of Bangladesh"** or **"GUB"**.
    - Checks video titles, channel names, and descriptions.

3.  **UI Validation (Thumbnails)**:
    - Validates that video thumbnails are loading correctly.
    - Checks for broken images (natural width validation and HTTP status checks).
    - Takes a screenshot (`broken_thumbnails_suite_failure.png`) if broken thumbnails are detected.

##  Reporting

This project uses **Mochawesome** to generate detailed HTML reports.

After running the tests, you can find the report in:
 `mochawesome-report/mochawesome.html`

Open this file in your browser to view the test results, execution time, and pass/fail status.

##  Author

**Syed Raiyan Nasim**

Syed Raiyan Nasim
*Happy Testing!*
