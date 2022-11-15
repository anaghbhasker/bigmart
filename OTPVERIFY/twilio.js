
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const serviceId= process.env.SERVICESID


module.exports.otpSend= (phone) =>{
    
  const client = require('twilio')(accountSid, authToken);

  client.verify.v2.services(serviceId)
                .verifications
                .create({to:  `+91${phone}`, channel: 'sms'})
                .then(verification => console.log(verification.sid));
}


module.exports.otpVerify=(phone,otp,abc)=>{
    
    const client = require('twilio')(accountSid, authToken);
    client.verify.v2.services(serviceId)
      .verificationChecks
      .create({to:  `+91${phone}`, code: otp})
      .then(verification_check =>{
        if (verification_check.status=="approved") {
          abc(true)           
        } else{
            abc(false)
        }
      });
}


