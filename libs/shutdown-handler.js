const ShutdownHandler = {
    handle(server){
        this.server = server;
        this.killSignalCount = 0;

        process.on('SIGTERM', () => this.shutdown());
        process.on('SIGINT', () => this.shutdown());
    },

    shutdown(){
        this.killSignalCount += 1;
        switch(this.killSignalCount){
            case 1:
                logger.info('Received kill signal, shutting down gracefully');
                this.server.close(() => {
                    logger.info('Close server complete');
                    process.exit(0);
                });
    
                /**
                 * 'Docker stop' wait for 10 seconds
                 * so we have to shutdown server in 8s (2s margin) if possible
                 */
                setTimeout(() => {
                    logger.error('Could not close server in 8s, shutting down forcefully');
                    process.exit(1);
                }, 8000);
                break;
    
            case 2:
                logger.info('Hit one more SIGTERM/SIGINT to forcefully kill server');
                break;
            
            case 3:
                logger.info('Kill forcefully');
                process.exit(1);
        }
    }
}

module.exports = ShutdownHandler;