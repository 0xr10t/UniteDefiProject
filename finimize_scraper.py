# from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


import undetected_chromedriver as uc

options = uc.ChromeOptions()
# options.add_argument("--headless")
driver = uc.Chrome()
driver.get("")

# DON'T USE UBUNTU FFS
# FUCK SNAPS

# options = Options()
# options.add_argument("--headless")s
# driver = webdriver.Firefox(options=options)
# driver.get("https://finimize.com/topics/etfs")


try:
    wait = WebDriverWait(driver, 10)
    cookie_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Accept All')]")))
    cookie_button.click()
except:
    print("Cookie popup not found or already closed.")


print(driver.title)

# driver.quit()
