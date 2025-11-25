// src/lib/utils/projectUtils.ts
import { Project } from "../../entities/project/types";

export interface ProjectTreeNode {
  project: Project;
  children: ProjectTreeNode[];
}

export function buildProjectTree(projects: Project[]): ProjectTreeNode[] {
  // Create a map of all projects by ID for quick lookup
  const projectMap = new Map<string, ProjectTreeNode>();
  
  // Initialize all projects as tree nodes
  projects.forEach(project => {
    projectMap.set(project.id, { project, children: [] });
  });

  // Array to store root nodes (projects with no parent)
  const rootNodes: ProjectTreeNode[] = [];

  // Build the tree structure
  projects.forEach(project => {
    const node = projectMap.get(project.id)!;
    
    if (project.parentId) {
      // If project has a parent, add it as a child to its parent
      const parentNode = projectMap.get(project.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      }
    } else {
      // If project has no parent, it's a root node
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

export function flattenProjectTree(tree: ProjectTreeNode[]): Project[] {
  const projects: Project[] = [];
  
  function traverse(node: ProjectTreeNode) {
    projects.push(node.project);
    node.children.forEach(traverse);
  }
  
  tree.forEach(traverse);
  
  return projects;
}