const mailer=require('nodemailer');


exports.sendMail=function(mailOptions){
    let transporter=mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: '',
            pass: ''
        }
    });
    const mailOptions={
        from: '',
        to: '',
        subject: '',
        text: ''
    };
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log('Email sent: '+info.response);
        }
    });
}