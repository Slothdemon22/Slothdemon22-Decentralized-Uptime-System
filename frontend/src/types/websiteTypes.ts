export interface TickData {
    _id?: string;
    status: string;
    responseTime?: number;
    createdAt: string;
  }
  
  export interface WebsiteData {
    _id: string;
    url: string;
    Ticks?: TickData[];
  }
  
  export interface SystemHealth {
    healthy: number;
    total: number;
    percentage: number;
  }