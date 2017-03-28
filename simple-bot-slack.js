require('dotenv').load();

var express = require('express');
var Botkit = require('botkit');
var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  version_date: '2017-02-07'
});

// Configure your bot
var slackController = Botkit.slackbot({
    require_delivery: true,
  });

var slackBot = slackController.spawn({
  token: process.env.SLACK_TOKEN
}).startRTM();


slackController.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
  slackController.log('Slack message received');
  middleware.interpret(bot, message, function(err) {
    if (!err){
      //NÃO É GOODBYE E INDENTIFICOU UMA INTENÇÃO
      if(!(typeof message.watsonData.intents[0] == "undefined")){
        //Impressora
        switch(message.watsonData.intents[0].intent){
          case 'Impressora':
            bot.startConversation(message,function(err,conv){
            conv.say({attachments:[{
              "text": (message.watsonData.context.name+", "+message.watsonData.output.text[0]),
            },{
              "text": message.watsonData.output.text[1],
            },{
              "text": message.watsonData.output.text[2],
              "image_url":message.watsonData.context.Img1,
            },{
              "text": message.watsonData.output.text[3],
              "image_url":message.watsonData.context.Img2,
            },{
              "text": message.watsonData.output.text[4],
              "image_url":message.watsonData.context.Img3,
            },{
              "text": message.watsonData.output.text[5],
              "image_url":message.watsonData.context.Img4,
            },{
              "text": message.watsonData.output.text[6],
              "image_url":message.watsonData.context.Img5,
            },{
              "text": message.watsonData.output.text[7],
              "image_url":message.watsonData.context.Img6,
            },{
              "text": message.watsonData.output.text[8],
            },{
              "text": message.watsonData.output.text[9],
              "image_url":message.watsonData.context.Img7,
            },{
              "text": message.watsonData.output.text[10],
              "image_url":message.watsonData.context.Img8,
            },{
              "text": message.watsonData.output.text[11],
              "image_url":message.watsonData.context.Img9,
            },{
              "text": message.watsonData.output.text[12],
              "image_url":message.watsonData.context.Img10,
            },{
              "text": message.watsonData.output.text[13],
            }]});
          });
            break;
          case 'Saudação':
            bot.api.users.info({
            token: process.env.SLACK_TOKEN,
            user: message.user}, function(err, info){
              message.watsonData.context.name = info.user.profile.real_name;
              nome =  info.user.profile.first_name;
              bot.reply(message,message.watsonData.output.text.join('\n'));
                            });
            break;
          default:
            bot.reply(message, message.watsonData.output.text.join('\n'));
            break;
        }
      //INTENT INDEFINIDA
      }else{
        //Verifica se ja possui o nome do usuario
        if(message.watsonData.context.name == ""){
          bot.api.users.info({
            token: process.env.SLACK_TOKEN,
            user: message.user}, function(err, info){
              message.watsonData.context.name = info.user.profile.real_name;
              nome =  info.user.profile.first_name;
                            });
          bot.reply(message, message.watsonData.output.text.join('\n'));
        }else{
          bot.reply(message, message.watsonData.output.text.join('\n'));
        }
        
      }
    }//IF ERR
  });
});

var app = express();
var port = process.env.PORT || 3000;
app.set('port', port);
app.listen(port, function() {
  console.log('Client server listening on port ' + port);
});
/*
------------------------------ENVIAR IMAGEM NO SLACK--------------------------
bot.reply(message, {attachments:[{
           "text": "Até logo!",
            "image_url": "https://platform.slack-edge.com/img/default_application_icon.png",

        }]});
*/



/*
 ----------------------- Chamando um serviço soap-----------------------------
  EXECUTAR NPM --> npm install soap
  
  var soap = require('soap');
  var url = 'http://trbnetdsv.tribanco.com.br/Tribanco.KonySync.WS/service.asmx?wsdl';
  var args = {CodigoComercial: '2179'};
  soap.createClient(url, function(err, client) {
     --------------------------coloca o cliente instanciado com o soap---------------------------------------------------------------------------
     --------------------------informa que é um seviço soap--------------------------------------------------------------------------------------
     --------------------------define o método do soap passando os argumentos e uma função para realizar oq se deseja----------------------------
      client.Service.ServiceSoap.ValidaCarteira(args, function(err, result) {
          console.log(result);
      });
  });
*/