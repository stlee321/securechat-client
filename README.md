# Secure Chat Client

모든 채팅 메세지, 이미지가 암호화 되어 전송 됩니다.

채팅방 생성시 만들어지는 대칭키를 이용해 암호화 합니다.

Crypto.subtle Web API를 이용합니다.(https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

암호화 알고리즘 : AES-GCM
