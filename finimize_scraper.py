from selenium import webdriver
from selenium.webdriver.firefox.options import Options

# DON'T USE UBUNTU FFS
# FUCK SNAPS

options = Options()
# options.add_argument("--headless")
driver = webdriver.Firefox(options=options)
driver.get("https://www.python.org")

print(driver.title)

driver.quit()
