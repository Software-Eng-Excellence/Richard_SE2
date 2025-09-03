import { v4 as uuidv4 } from 'uuid';

export const generateUUID = (prefix?: string): string => {
    return prefix ? `${prefix}-${uuidv4()}` : uuidv4();
};
