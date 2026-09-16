interface RepositoryFile {
  path: string;
  type: string;
}

interface RepositoryMetrics {
  totalFiles: number;
  totalFolders: number;
  fileTypes: Record<string, number>;
}

export function calculateRepositoryMetrics(
  files: RepositoryFile[]
): RepositoryMetrics {
  const fileTypes: Record<string, number> = {};

  let totalFiles = 0;
  let totalFolders = 0;

  for (const file of files) {
    if (file.type === "tree") {
      totalFolders++;
      continue;
    }

    totalFiles++;

    const parts = file.path.split(".");
    
    if (parts.length < 2) {
      fileTypes["other"] = (fileTypes["other"] || 0) + 1;
      continue;
    }

    const extension = `.${parts[parts.length - 1]}`;

    fileTypes[extension] =
      (fileTypes[extension] || 0) + 1;
  }

  return {
    totalFiles,
    totalFolders,
    fileTypes,
  };
}