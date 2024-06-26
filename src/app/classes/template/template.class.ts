import { DebugElement, Predicate, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

interface NativeElement {
    textContent: string;
    click: () => void;
}

// Class to encapsulate common template unit testing operations
export class Template<T> {
    constructor(private readonly fixture: ComponentFixture<T>) {}

    click(predicate: Predicate<DebugElement>): void {
        const debugElement = this.get(predicate);

        if (!debugElement) {
            throw Error(
                `Error trying to click element. It could not be found.`
            );
        }

        const nativeElement = debugElement.nativeElement as NativeElement;

        nativeElement.click();
    }

    detectChanges(checkNoChanges?: boolean): void {
        this.fixture.detectChanges(checkNoChanges);
    }

    get(predicate: Predicate<DebugElement>): DebugElement | null {
        return this.fixture.debugElement.query(predicate);
    }

    getAll(predicate: Predicate<DebugElement>): DebugElement[] {
        return this.fixture.debugElement.queryAll(predicate);
    }

    getChildComponent(component: Type<any>): any {
        return this.fixture.debugElement.query(By.directive(component))
            ?.componentInstance;
    }

    getCount(predicate: Predicate<DebugElement>): number {
        return this.fixture.debugElement.queryAll(predicate).length;
    }

    getTextContent(predicate: Predicate<DebugElement>): string {
        const debugElement = this.get(predicate);

        if (!debugElement) {
            throw Error(
                `Error trying to get text content of element. It could not be found.`
            );
        }

        const nativeElement = debugElement.nativeElement as NativeElement;

        return nativeElement.textContent.trim();
    }
}
