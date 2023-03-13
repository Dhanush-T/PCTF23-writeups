from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import os
from dotenv import load_dotenv
from time import sleep
from pymongo import MongoClient
import smtplib, ssl
from webdriver_manager.chrome import ChromeDriverManager

load_dotenv()

db = MongoClient(os.getenv('DB_HOST'))['backend'] # Establishes connection to local mongo server on port 27017
users = db.users


chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--ignore-ssl-errors')
chrome_options.set_capability('unhandledPromptBehavior', 'accept')
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")
# chrome_options.add_experimental_option('prefs', {
#     'credentials_enable_service': False,
#     'download_restrictions': 3,
#     'profile': {
#         'password_manager_enabled': False
#     }
# })

driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)


while(True):
    try:   
        sleep(5) # for admin token to get set in server.js
        driver.get("http://backend:3000/admin")
        break
    except Exception as e:
        print(e)

driver.add_cookie({"name":"token", "value": os.getenv('ADMIN_TOKEN')})


while(True):

    for doc in users.find():
        if doc['changed'] == True and doc['score'] >= 2:
            print("User "+doc['username']+" changed their username")

            users.update_one({'username' : doc['username']}, {'$set' : {'changed': False}})
            driver.get("http://backend:3000/admin?username="+doc['username'])
            sleep(0.5)
            check = driver.get_cookie('flag')
            sleep(0.5)
            if(check and check['value']=="1"):
                print("changing admin email for user:"+doc['username'])
                email = driver.get_cookie('email')
                users.update_one({'username' : doc['username']}, {'$set' : {'adminEmail': email['value']}})
            elif(check and check['value']=="2"):
                
                try:
                    # Create a secure SSL context
                    context = ssl.create_default_context()

                    print("sending password to admin email of user:"+doc['username'])
                    s = smtplib.SMTP('smtp.gmail.com', 587)
                    s.starttls(context=context)
                    s.login(os.getenv('APP_EMAIL'), os.getenv('APP_PASS'))
                    message = f"\nPassword: {os.getenv('ADMIN_PASSWORD')}"
                    s.sendmail(os.getenv('APP_EMAIL'), doc['adminEmail'], message)
                except Exception as e:  
                    # Print any error messages to stdout
                    print(e)
                finally:
                    s.quit()

    sleep(2)