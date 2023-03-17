const webdriver = require('selenium-webdriver'), By = webdriver.By, until = webdriver.until;


// Function that enters the username, passoword, then clicks Submit
function enterAccountCredentials(driver) {
    driver.findElement(webdriver.By.id('email')).sendKeys('user@abc').then(function() {
        setTimeout(function(){
            driver.findElement(webdriver.By.id('password')).sendKeys('123').then(function() {
                setTimeout(function(){
                    driver.findElement(webdriver.By.id('submit')).click();
                }, 2000);
            });
        }, 2000);
    });
}

// Function that enters the Item Name, Description, Price then clicks Submit
function addItem(driver) {
    driver.get('http://localhost:8080/createItem').then(function(){
        setTimeout(function(){
            driver.findElement(webdriver.By.id('ItemName')).sendKeys('testItem').then(function() {
                setTimeout(function(){
                    driver.findElement(webdriver.By.id('Description')).sendKeys('A temporary item created to test functionality').then(function() {
                        setTimeout(function(){
                            driver.findElement(webdriver.By.id('Price')).sendKeys('3.00').then(function() {
                                setTimeout(function(){
                                    driver.findElement(webdriver.By.id('submit')).click();
                                }, 2000);
                            });
                        }, 2000);
                    });
                }, 2000);
            }); 
        }, 2000);
    });
}

function searchTextOnGoogle() {

    // Open Browser
    var driver = new webdriver.Builder().forBrowser('chrome').build();
    // Landing page
    driver.get('http://localhost:8080/').then(function() { 

        // After 2 seconds go to the login page and enter account credentials
        setTimeout(function(){
            driver.get('http://localhost:8080/login').then(enterAccountCredentials(driver));
        }, 2000);

        // After making it to the home page, go to the List Items Page
        setTimeout(function(){
            driver.get('http://localhost:8080/itemListing');
        }, 10000);


        // Adds an item
        setTimeout(function(){
            addItem(driver);
        }, 14000);


        // Deletes that item
        setTimeout(function(){
            driver.get('http://localhost:8080/itemListing').then(function() {
                driver.findElement(webdriver.By.id('cancel')).click().then(function() {
            
                });
            });
        }, 26000);


        // Go to the home page
        setTimeout(function(){
            driver.get('http://localhost:8080/home');
        }, 30000);


        // After done testing, log the title page and exit
        driver.getTitle().then(function(title) {
            setTimeout(function()
            {
                console.log(title);
                driver.quit();
            }, 40000);
        });
        
    });

}

searchTextOnGoogle();