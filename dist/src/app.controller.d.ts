import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStats(): Promise<{
        stats: {
            title: string;
            value: string;
            icon: string;
        }[];
        recentActivity: {
            id: number;
            code: string;
            quiz: string;
            score: number;
            time: string;
        }[];
    }>;
}
