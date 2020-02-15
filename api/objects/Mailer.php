<?php

// 'Email' Object
class Mailer {
    
    // database connection and table name
    private $mailer;
    private $table_name = "codes";
    private $email_max = "a.makro@web.de";
    private $email_finn = "a.makro@web.de";

    // object properties
    public $content;

    // constructor
    public function __construct($phpmail){
        $this->mailer = $phpmail;
    }

    // send Mail Functions
    public function sendSubmitMail() {

        try {

            //Recipients
            $this->mailer->setFrom('noreply@mks-software.de', 'noreply@mks-software.de');
            $this->mailer->addAddress($this->email_max);
            // $this->mailer->addAddress($this->email_finn);

            $this->mailer->CharSet = 'UTF-8';
            $this->mailer->Encoding = 'base64';

            //Content
            $this->mailer->isHTML(true);                                    // Set email format to HTML
            $this->mailer->Subject = 'PS - Neuer Event Vorschlag';
            $this->mailer->Body    = $this->content;
            $this->mailer->AltBody = strip_tags($this->content);

            $this->mailer->send();
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    /*
    public function sendPasswordResetMail() {

        try {

            //Recipients
            $this->mailer->setFrom('noreply@mks-software.de', 'noreply@mks-software.de');
            $this->mailer->addAddress($this->email);                        // Name is optional

            //Content
            $this->mailer->isHTML(true);                                    // Set email format to HTML
            $this->mailer->Subject = 'SMS - Passwort zurücksetzen';
            $etext = '<p>   Guten Tag, <br>
                            Hier können sie ihr Passwort zurücksetzen. <br>
                            Bitte klicken sie auf diesen <a href="https://mks-software.de/sms/resetpassword.html?code='.$this->code.'">Link</a> <br>
                            <br>
                            oder kopieren diese URL in ihren Browser: <br>
                            https://mks-software.de/sms/resetpassword.html?code='.$this->code.' </p>';
            $this->mailer->Body    = $etext;
            $this->mailer->AltBody = strip_tags($etext);

            $this->mailer->send();
        } catch (Exception $e) {
            return false;
        }

        return true;
    }
    */

}

?>