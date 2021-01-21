const Config = {
    debug_mode: false,
    server_name: 'Arrogant MMO Card Game Server',
    ip: 'localhost',
    port: process.env.PORT || 4000,
    db_host_url: "mongodb://localhost:27017/",
    db_name: 'test_card_mmo_db',
    start_zone: 1, //uses the unity scene build index at the moment
    start_money: 1000,
    start_position: {
        x: -0.15,
        y: 1,
        z: 6
    },
}
export default Config;