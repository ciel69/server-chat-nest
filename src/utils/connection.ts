import { FindManyOptions } from 'typeorm';

export interface Node {
  id: string;
}

export type Pagination = ForwardPagination & BackwardPagination;

export interface ForwardPagination {
  first: number;
  after: string;
}

export interface BackwardPagination {
  last: number;
  before: string;
}

export class Edge<T extends Node = any> {
  public cursor: string;
  public node: T;

  constructor(node: T) {
    this.node = node;
    this.cursor = Connection.btoa(node.id.toString());
  }
}

export class PageInfo<T extends Node = any> {
  public startCursor: string = null;
  public endCursor: string = null;
  public hasNextPage: boolean = false;
  public hasPreviousPage: boolean = false;

  constructor(edges: T[], total: number, options: Partial<FindManyOptions> = {}) {
    if (edges.length > 0) {
      if (options.order) {
        if (options.order.id === 'ASC') { // forward pagination
          this.hasNextPage = total > edges.length;
          this.endCursor = Connection.btoa(edges[edges.length - 1].id);
        } else if (options.order.id === 'DESC') { // backward pagination
          this.hasPreviousPage = total > edges.length;
          this.startCursor = Connection.btoa(edges[0].id);
        }
      }
    }
  }
}

export class Connection<T extends Node = any> {
  public static atob(input: string): string {
    return new Buffer(input, 'base64').toString('binary');
  }

  public static btoa(input: string): string {
    return new Buffer(input.toString(), 'binary').toString('base64');
  }

  public total: number;
  public pageInfo: PageInfo;
  public edges: Edge<T>[];

  constructor(edges: T[], total: number, options: FindManyOptions) {
    this.total = total;
    this.edges = edges.map((node) => new Edge<T>(node));
    this.pageInfo = new PageInfo<T>(edges, total, options);
  }
}
