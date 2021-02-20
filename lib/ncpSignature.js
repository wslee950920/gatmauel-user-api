const crypto = require('crypto');

const smsSignature=()=>{
    const space = " ";				// one space
	const newLine = "\n";				// new line
	const method = "POST";				// method
	const url = `/sms/v2/services/${process.env.NAVER_SMS_SERVICE_ID}/messages`;	// url (include query string)
	const timestamp = Date.now().toString();			// current timestamp (epoch)
	const accessKey = process.env.NAVER_ACCESS_KEY;			// access key id (from portal or Sub Account)
    const secretKey = process.env.NAVER_SECRET_KEY;			// secret key (from portal or Sub Account)
    
    const hmac=crypto.createHmac('sha256', secretKey);
    hmac.update(method);
	hmac.update(space);
	hmac.update(url);
	hmac.update(newLine);
	hmac.update(timestamp);
	hmac.update(newLine);
	hmac.update(accessKey);

    return hmac.digest('base64');
}

const bizSignature=()=>{
    const space = " ";				// one space
	const newLine = "\n";				// new line
	const method = "POST";				// method
	const url = `/alimtalk/v2/services/${process.env.NAVER_BIZ_SERVICE_ID}/messages`;	// url (include query string)
	const timestamp = Date.now().toString();			// current timestamp (epoch)
	const accessKey = process.env.NAVER_ACCESS_KEY;			// access key id (from portal or Sub Account)
    const secretKey = process.env.NAVER_SECRET_KEY;			// secret key (from portal or Sub Account)
    
    const hmac=crypto.createHmac('sha256', secretKey);
    hmac.update(method);
	hmac.update(space);
	hmac.update(url);
	hmac.update(newLine);
	hmac.update(timestamp);
	hmac.update(newLine);
	hmac.update(accessKey);

    return hmac.digest('base64');
}

module.exports={
	smsSignature,
	bizSignature
};