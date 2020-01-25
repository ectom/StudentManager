import yagmail

clients = [
    '@vtext.com',                       #Verizon
    '@txt.att.net',                     #AT&T
    '@messaging.sprintpcs.com',         #Sprint
    '@tmomail.net',                     #T-mobile
    '@myboostmobile.com',               #Boost Mobile
    '@sms.mycricket.com',               #Cricket
    '@vmobl.com',                       #Virgin Mobile
    '@text.republicwireless.com',       #Republic Wireless
    '@msg.fi.google.com',               #Project Fi
    '@email.uscc.net',                  #US Cellular
    '@message.alltel.com',              #Alltell
    '@message.ting.com'                 #Ting
];

sender = 'etom579@gmail.com'
receivers = ['4155956873@messaging.sprintpcs.com']
message = "Test Message"
try:
   smtpObj = yagmail.SMTP('smtp.gmail.com:587')
   smtpObj.send(subject="hi")
   smtpObj.sendmail(sender, receivers, message)
   print("Successfully sent email")
except smtplib.SMTPException:
   print("Error: unable to send email")

#
# number = '4155956873';              #add this to the parent's database
# carrier = 'Sprint';                 #add this to the parent's database
#
#
# send = smtplib.SMTP('smtp.gmail.com', 587)      # start gmail
# send.starttls()                                 # start Transport Layer Security to encrypt SMTP Commands
# send.login("etom579@gmail.com", "etom1521")
# message = "TEST MESSAGE"
# send.sendmail("etom579@gmail.com", "4155956873@messaging.sprintpcs.com", message)
# send.quit()
