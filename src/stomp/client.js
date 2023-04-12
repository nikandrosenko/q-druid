import Stomp from "stompjs";

const socket = new WebSocket(
  process.env.RABBITMQ_WEBSTOMP_URI || "wss://stud.druid.1t.ru/ws"
);
let client = Stomp.over(socket);

export default client;
