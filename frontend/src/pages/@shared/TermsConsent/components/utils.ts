import { useMyAccountId } from "hooks/hooks";
import { useEffect, useState } from "react";

interface UserConsents {
  [walletAddress: string]: string;
}

export class UserConsentStorage {
  private storageKey: string = "userConsents";

  // Добавить согласие пользователя с текущей датой
  public addUserConsent(walletAddress: string): void {
    try {
      const consents: UserConsents = this.getConsents();
      consents[walletAddress] = new Date().toISOString();
      this.saveConsents(consents);
    } catch (error) {
      console.error("Error while adding user consent:", error);
    }
  }

  // Получить согласие пользователя
  public getUserConsent(walletAddress?: string): string | null {
    if (!walletAddress) return null;

    try {
      const consents: UserConsents = this.getConsents();
      return consents[walletAddress] || null;
    } catch (error) {
      console.error("Error while getting user consent:", error);
      return null;
    }
  }

  // Удалить согласие пользователя
  public removeUserConsent(walletAddress: string): void {
    try {
      const consents: UserConsents = this.getConsents();
      delete consents[walletAddress];
      this.saveConsents(consents);
    } catch (error) {
      // eng
      console.error("Error while removing user consent:", error);
    }
  }

  public onChange = (callback: (consents: UserConsents) => void): void => {
    const listener = (event) => {
      if (event.key === this.storageKey) {
        callback(this.getConsents());
      }
    };
    window.addEventListener("storage", listener);
    return window.removeEventListener("storage", listener);
  };

  private getConsents(): UserConsents {
    try {
      const consents = localStorage.getItem(this.storageKey);
      return consents ? (JSON.parse(consents) as UserConsents) : {};
    } catch (error) {
      console.error("Error while getting data from localStorage:", error);
      return {};
    }
  }

  private saveConsents(consents: UserConsents): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(consents));
    } catch (error) {
      console.error("Error while saving data to localStorage:", error);
    }
  }
}

const userConsentStorage = new UserConsentStorage();

export const useConsent = () => {
  const myAccountId = useMyAccountId();
  const [dateOfConsent, setDateOfConsent] = useState<string | null>(
    userConsentStorage.getUserConsent(myAccountId)
  );

  useEffect(() => {
    if (!myAccountId) return;

    setDateOfConsent(userConsentStorage.getUserConsent(myAccountId));

    return userConsentStorage.onChange((consents) => {
      setDateOfConsent(consents[myAccountId] || null);
    });
  }, [myAccountId]);

  return {
    dateOfConsent,
    giveConsent: () => {
      if (!myAccountId) {
        console.error("Account id is not defined");
        return;
      }
      userConsentStorage.addUserConsent(myAccountId);
      setDateOfConsent(userConsentStorage.getUserConsent(myAccountId));
    },
  };
};
