import {Component, OnInit} from '@angular/core';
import {v4} from 'uuid';
import {DatePipe, DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {Category, ContextValue} from "./types";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DatePipe, NgForOf, FormsModule, DecimalPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'budget-builder';
  startDate: string = "2024-01";
  endDate: string = "2024-12";
  months: string[] = [];
  income: Category[] = [
    {
      id: v4(),
      data: [],
      label: 'General Income',
      subCategories: [
        {
          id: v4(),
          data: [],
          label: 'Salary',
          subCategories: []
        },
        {
          id: v4(),
          data: [],
          label: 'Commissions',
          subCategories: []
        }
      ]
    },
    {
      id: v4(),
      data: [],
      label: 'Other Income',
      subCategories: [
        {
          id: v4(),
          data: [],
          label: 'Training',
          subCategories: []
        },
        {
          id: v4(),
          data: [],
          label: 'Interest',
          subCategories: []
        }
      ]
    }
  ]
  expenses: Category[] = [
    {
      id: v4(),
      data: [],
      label: 'General Expenses',
      subCategories: [
        {
          id: v4(),
          data: [],
          label: 'Rent',
          subCategories: []
        },
        {
          id: v4(),
          data: [],
          label: 'Utilities',
          subCategories: []
        }
      ]
    },
    {
      id: v4(),
      data: [],
      label: 'Other Expenses',
      subCategories: [
        {
          id: v4(),
          data: [],
          label: 'Groceries',
          subCategories: []
        },
        {
          id: v4(),
          data: [],
          label: 'Clothing',
          subCategories: []
        }
      ]
    }
  ]
  contextMenuVisible = false;
  contextMenuPosition = {x: 0, y: 0};
  currentData: ContextValue | null = null;

  onChangeMonths(key: 'startDate' | 'endDate', e: Event) {
    this[key] = (e.target as HTMLInputElement).value;
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      if (start > end) {
        this.endDate = this.startDate
      }
      this.handleRenderMonth();
    }
  }

  calculateSubTotal(subCategory: Category[], monthId: string) {
    const value = subCategory.map(sc => sc.data.find(data => data.monthId === monthId)?.value || 0)
    return value.reduce((acc, data) => Number(acc) + Number(data), 0);
  }

  calculateCategoryTotal(category: Category[], monthId: string) {
    let sumSubTotal = 0;
    for (let subCategory of category) {
      sumSubTotal += this.calculateSubTotal(subCategory.subCategories, monthId);
    }
    return sumSubTotal;
  }

  calculateGrandTotal(monthId: string) {
    return this.calculateCategoryTotal(this.income, monthId) - this.calculateCategoryTotal(this.expenses, monthId);
  }

  calculateOpenBalance(index: number): number {
    if (index === 0) {
      return 0;
    }
    return this.calculateCloseBalance(index - 1);
  }

  calculateCloseBalance(index: number): number {
    if (index === 0) {
      return this.calculateGrandTotal(this.months[index]);
    } else {
      return this.calculateOpenBalance(index) + this.calculateGrandTotal(this.months[index]);
    }
  }

  addSubCategory(groupKey: 'income' | 'expenses', index: number) {
    const insertData: any[] = [];
    for (let month of this.months) {
      insertData.push({
        monthId: month,
        value: 0
      })
    }
    this[groupKey] = this[groupKey].map((category: Category, i) => i === index ? ({
      ...category,
      subCategories: category.subCategories.concat({
        id: v4(),
        data: insertData.map(data => ({
          ...data,
          id: v4()
        })),
        label: 'New Sub Category',
        subCategories: []
      })
    }) : category)
  }

  deleteSubCategory(groupKey: 'income' | 'expenses', index: number, id: string) {
    this[groupKey] = this[groupKey].map((category: Category, i) => i === index ? ({
      ...category,
      subCategories: category.subCategories.filter(sc => sc.id !== id)
    }) : category)
  }

  addCategory(groupKey: 'income' | 'expenses') {
    const insertData: any[] = [];
    for (let month of this.months) {
      insertData.push({
        monthId: month,
        value: 0
      })
    }
    this[groupKey] = this[groupKey].concat({
      id: v4(),
      data: insertData.map(data => ({
        ...data,
        id: v4()
      })),
      label: 'New Category',
      subCategories: []
    })
  }

  deleteCategory(groupKey: 'income' | 'expenses', id: string) {
    this[groupKey] = this[groupKey].filter(category => category.id !== id)
  }

  handleRenderMonth() {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (start === end) {
      this.months = [`${start.toLocaleString('default', {month: 'long', year: 'numeric'})}`];
    } else {
      const years = end.getFullYear() - start.getFullYear();
      let months: string[] = [];
      let current = new Date(start);
      while (current <= end) {
        const formattedDate = current.toLocaleString('default', {month: 'long', year: 'numeric'});
        months.push(formattedDate);
        current.setMonth(current.getMonth() + 1);
      }
      const insertData: any[] = [];
      for (let month of months) {
        insertData.push({
          monthId: month,
          value: 0
        })
      }

      this.months = months;

      this.income = this.income.map(i => ({
        ...i,
        data: insertData.map(data => ({
          ...data,
          id: v4()
        })),
        subCategories: i.subCategories.map(sc => ({
          ...sc,
          data: insertData.map(data => ({
            ...data,
            id: v4()
          })),
        }))
      }))

      this.expenses = this.expenses.map(i => ({
        ...i,
        data: insertData.map(data => ({
          ...data,
          id: v4()
        })),
        subCategories: i.subCategories.map(sc => ({
          ...sc,
          data: insertData.map(data => ({
            ...data,
            id: v4()
          })),
        }))
      }))

    }
  }

  openContext(event: MouseEvent, groupKey: 'income' | 'expenses', index: number, subIndex: number, value: number) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = {x: event.clientX, y: event.clientY};
    this.currentData = {
      groupKey,
      index,
      subIndex,
      value
    }


  }

  applyToAll() {
    if (!this.currentData) return;
    const {groupKey, index, value, subIndex} = this.currentData;
    this[groupKey] = this[groupKey].map((category: Category, i) => i === index ? ({
      ...category,
      subCategories: category.subCategories.map((subCategory, j) => subIndex === j ? ({
        ...subCategory,
        data: subCategory.data.map(data => ({
          ...data,
          value
        }))
      }) : subCategory)
    }) : category)
    this.contextMenuVisible = false
  }

  onCloseContextMenu() {
    this.contextMenuVisible = false
  }

  ngOnInit(): void {
    this.handleRenderMonth()
  }
}
