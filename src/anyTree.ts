export class Node {
  constructor(
    private parent?: Node,
  ) {
    this.parent = parent;
  }
}

function asList(v: string[] | string) {
  return Array.isArray(v) ? v : [v];
}

type Filter = { [key: string]: string[] } | { [key: string]: string };

export class BranchNode extends Node {
  constructor(
    public tag: string,
    public line: number,
    public endLine: number,
    public column: number,
    public endColumn: number,
    public text: string,
    public children: (BranchNode | LeafNode)[] | undefined,
    parent?: RootNode | BranchNode | undefined,
  ) {
    super(parent);
    this.tag = tag;
    this.line = line;
    this.endLine = endLine;
    this.column = column;
    this.endColumn = endColumn;
    this.text = text;
    this.children = children;
  }

  private iterFind(targetObj: BranchNode[] | BranchNode, filter: string): BranchNode[] {
    let indexOf: BranchNode[] = [];
    if (!Array.isArray(targetObj)) {
      if (Object.values(targetObj).indexOf(filter) !== -1) {
        indexOf.push(targetObj);
      }
    } else {
      const values = Object.values(targetObj);
      const objs = values.reduce((founds: BranchNode[], targetValue: string | BranchNode) => {
        if (typeof targetValue === 'object') {
          if (targetValue !== null) {
            return this.iterFind(targetValue, filter);
          }
        }
        return founds;
      }, []);
      indexOf = indexOf.concat(objs);
    }
    return indexOf;
  }

  public iterFindAll(filter: Filter): BranchNode[] {
    let indexOf: BranchNode[] = [];
    asList(filter.tag).forEach((f) => {
      if (this.children !== undefined) {
        indexOf = indexOf.concat(this.iterFind(this.children as BranchNode[], f));
      }
    });
    return indexOf;
  }

  public find(filter: Filter): BranchNode {
    const nodes = this.iterFindAll(filter);
    return nodes[0];
  }
}

export class RootNode extends BranchNode {
  constructor(
    tag: string,
    line: number,
    endLine: number,
    column: number,
    endColumn: number,
    text: string,
    children?: (BranchNode | LeafNode)[],
  ) {
    super(tag, line, endLine, column, endColumn, text, children, undefined);
  }
}

export class LeafNode extends Node {
  constructor(
    public tag: string,
    public line: number,
    public endLine: number,
    public column: number,
    public endColumn: number,
    public text: string,
    parent?: RootNode | BranchNode,
  ) {
    super(parent);
    this.tag = tag;
    this.line = line;
    this.endLine = endLine;
    this.column = column;
    this.endColumn = endColumn;
    this.text = text;
  }
}

function transform(tree: BranchNode | LeafNode): BranchNode | LeafNode {
  if (('children' in tree) && (tree.children !== undefined)) {
    const children: (BranchNode | LeafNode)[] = [];
    tree.children.forEach((child) => {
      if ('children' in child) {
        children.push(transform(child));
      } else {
        children.push(new LeafNode(
          child.tag,
          child.line,
          child.endLine,
          child.column,
          child.endColumn,
          child.text,
        ));
      }
    });
    return new BranchNode(
      tree.tag,
      tree.line,
      tree.endLine,
      tree.column,
      tree.endColumn,
      tree.text,
      children,
    );
  }
  return new LeafNode(
    tree.tag,
    tree.line,
    tree.endLine,
    tree.column,
    tree.endColumn,
    tree.text,
  );
}

export function transformTree(tree: RootNode): RootNode {
  if (tree.children === undefined) {
    return new RootNode(
      tree.tag,
      tree.line,
      tree.endLine,
      tree.column,
      tree.endColumn,
      tree.text,
    );
  }

  const children: (BranchNode | LeafNode)[] = [];
  tree.children.forEach((child) => {
    if ('children' in child) {
      children.push(transform(child));
    } else {
      children.push(new LeafNode(
        child.tag,
        child.line,
        child.endLine,
        child.column,
        child.endColumn,
        child.text,
      ));
    }
  });
  return new RootNode(
    tree.tag,
    tree.line,
    tree.endLine,
    tree.column,
    tree.endColumn,
    tree.text,
    children,
  );
}
