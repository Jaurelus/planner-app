/**
 * Get package information from package.json
 */
export declare function getPackageInfo(): Promise<{
    name: any;
    version: any;
}>;
/**
 * Get the user's project package.json
 */
export declare function getUserPackageInfo(): Promise<{
    path: string;
    data: any;
    exists: boolean;
}>;
/**
 * Check if a package is installed in the user's project
 */
export declare function isPackageInstalled(packageName: string): Promise<boolean>;
