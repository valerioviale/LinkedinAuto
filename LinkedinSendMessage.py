from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install())) #starts the webdriver
driver.get("https://linkedin.com") #open a specific page

#driver = webdriver.Chrome("C:/Users/viale/Desktop/Automation/chromedriver.exe")

time.sleep(2)

username = driver.find_element(By.XPATH,"//input[@name='session_key']")
password = driver.find_element(By.XPATH,"//input[@name='session_password']")

username.send_keys("viale.valerio@gmail.com")  #insert here between " " your username
password.send_keys("1carnival")                   #insert here between " " your password

time.sleep(2)


submit = driver.find_element(By.XPATH,"//button[@type='submit']").click() #click on the submit button to login

time.sleep(4)

### end of the login process


import random #we use random to have random salutations, Hola, Buenas...

n_pages = 3 # number of pages you want to submit excluding the last one, range is not inclusive

for n in range(1,n_pages):
    # *** Add to the next line the page where you want to start to send messages, if you want to use recently added connection just remove +str(n)
    # and add https://www.linkedin.com/mynetwork/invite-connect/connections/
    driver.get("https://www.linkedin.com/mynetwork/invite-connect/connections/" )
    time.sleep(2)

    all_buttons = driver.find_elements(By.TAG_NAME,"button")
    message_buttons =  [btn for btn in all_buttons if "Message" in btn.text]


    for i in range(0, len(message_buttons)): # for the range going from the first person on the list 0 to the end of the page element 9
        #click on message buttons
        driver.execute_script("arguments[0].click();",message_buttons[i])
        time.sleep(2)

        
        #activate main_div
        main_div = driver.find_element(By.XPATH,"//div[starts-with(@class, 'msg-form__msg-content-container')]")
        driver.execute_script("arguments[0].click();",main_div)

        #type message
        paragraphs = driver.find_elements(By.TAG_NAME,"p")
        
        all_span = driver.find_elements(By.TAG_NAME,"span")
        all_span = [s for s in all_span if s.get_attribute("class") == "mn-connection-card__name t-16 t-black t-bold"]

        idx = [*range(0,10,1)]  #(where the list starts, total number of elements in the list, space between the elements)
        greetings = ["Buongiorno", "Ciao"] # you can personalize with different salutations
        all_names = []
        
        for j in idx:
            name = all_span[j].text.split(" ")[0]
            all_names.append(name)
            
        greetings_idx = random.randint(0, len(greetings)-1)
        # you should personalize this message depending on the campaigns you are running
        message = greetings[greetings_idx] + " " + all_names[i] + ", Es un placer añadirte a mi red de contactos." 
        paragraphs[-5].send_keys(message)
        time.sleep(2)

        ### send message, please comment it during the phases of setting and fine tuning to avoid sending unwanted test messages to your prospect
        submit = driver.find_element(By.XPATH,"//button[@type='submit']")
        driver.execute_script("arguments[0].click();",submit)


        time.sleep(2)

        # the bot is going to close the pop up windows before to pass to the next loop or stop
        close_button = driver.find_element(By.XPATH,"//button[@class = 'msg-overlay-bubble-header__control artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view']")
        driver.execute_script("arguments[0].click();",close_button)

        time.sleep(2)
        
        
        
# Use the following code to check if the span class to extract the name is still valid, they change it a lot
# import random
# all_span = driver.find_elements(By.TAG_NAME,"span")
# all_span = [s for s in all_span if s.get_attribute("class") == "mn-connection-card__name t-16 t-black t-bold"]

# idx = [*range(0,40,1)]

# greetings = ["Hello", "Hi", "Dear"]

# print(idx)

# for i in idx:
#     greetings_idx = random.randint(0, len(greetings)-1)
#     name = all_span[i].text.split(" ")[0]
#     print(greetings[greetings_idx] + " " + name + ", it's a pleasure to add you to my contacts.")
    