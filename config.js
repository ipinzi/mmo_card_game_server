const Config = {
    server_name: 'Arrogant MMO Card Game Server',
    ip: 'localhost',
    port: process.env.PORT || 4000,
    db_host_url: "mongodb://localhost:27017/",
    db_name: 'test_card_mmo_db',
}
export default Config;