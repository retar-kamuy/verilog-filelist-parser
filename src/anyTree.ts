export class Node {
  constructor(
    private parent?: Node,
  ) {
    this.parent = parent;
  }

  iterFind(targetObj: Node | Node[], filter: string, initialValue?: Node[]): Node[] {
    const initValues = initialValue !== undefined ? initialValue : [];
    let foundObjs: Node[] = initValues;
    if (Array.isArray(targetObj)) {
      const objs = targetObj.reduce((founds, obj) => {
        const results = this.iterFind(obj, filter, founds);
        return founds.concat(results);
      }, initValues);
      foundObjs = foundObjs.concat(objs);
    } else if (Object.values(targetObj).indexOf(filter) !== -1) {
      foundObjs.push(targetObj);
    } else {
      const objs = Object.values(targetObj).reduce((founds: Node[], targetValue: Node | string) => {
        if (typeof targetValue === 'object') {
          if (targetValue !== null) {
            return this.iterFind(targetValue, filter, founds);
          }
        }
        return founds;
      }, initValues);
      foundObjs = foundObjs.concat(objs);
    }
    return foundObjs;
  }

  /* iterFindAll(filters: { [key: string]: string[] }): Node[] {
    let foundObjs: Node[] = [];
    // filters.tag.forEach((filter) => {
    //   foundObjs = foundObjs.concat(this.iterFind(this.children, filter));
    // });
    return foundObjs;
  } */
}

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
          tree.tag,
          tree.line,
          tree.endLine,
          tree.column,
          tree.endColumn,
          tree.text,
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
        tree.tag,
        tree.line,
        tree.endLine,
        tree.column,
        tree.endColumn,
        tree.text,
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
