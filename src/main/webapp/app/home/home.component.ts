import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../entities/message/message.model';
import { MessageService } from '../entities/message/message.service';
// import { Message, MessageService } from '../entities/message/message.model';
// import { Message, MessageService } from 'src/main/webapp/app/entities/message';
// import { Message } from './message.model';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Account, LoginModalService, Principal, ITEMS_PER_PAGE } from '../shared';
import { JhiEventManager, JhiAlertService, JhiDataUtils, JhiParseLinks } from 'ng-jhipster';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit, OnDestroy {
    messages: Message[];
    currentAccount: any;
    eventSubscriber: Subscription;
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    queryCount: any;
    reverse: any;
    totalItems: number;
    currentSearch: string;
    account: Account;
    modalRef: NgbModalRef;
//
    constructor(
            private messageService: MessageService,
            private jhiAlertService: JhiAlertService,
            private dataUtils: JhiDataUtils,
            private eventManager: JhiEventManager,
            private parseLinks: JhiParseLinks,
            private activatedRoute: ActivatedRoute,
            private principal: Principal,
            private loginModalService: LoginModalService
        ) {
            this.messages = [];
            this.itemsPerPage = ITEMS_PER_PAGE;
            this.page = 0;
            this.links = {
                last: 0
            };
            this.predicate = 'id';
            this.reverse = true;
            this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
                this.activatedRoute.snapshot.params['search'] : '';
        }

    loadAll() {
        if (this.currentSearch) {
            this.messageService.search({
                query: this.currentSearch,
                page: this.page,
                size: this.itemsPerPage,
                sort: this.sort()
            }).subscribe(
                (res: HttpResponse<Message[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
            return;
        }
        this.messageService.query({
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: HttpResponse<Message[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    reset() {
        this.page = 0;
        this.messages = [];
        this.loadAll();
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }

    clear() {
        this.messages = [];
        this.links = {
            last: 0
        };
        this.page = 0;
        this.predicate = 'id';
        this.reverse = true;
        this.currentSearch = '';
        this.loadAll();
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.messages = [];
        this.links = {
            last: 0
        };
        this.page = 0;
        this.predicate = '_score';
        this.reverse = false;
        this.currentSearch = query;
        this.loadAll();
    }

    registerChangeInMessages() {
        this.eventSubscriber = this.eventManager.subscribe('messageListModification', (response) => this.reset());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        for (let i = 0; i < data.length; i++) {
            this.messages.push(data[i]);
        }
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerChangeInMessages();
        this.registerAuthenticationSuccess();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Message) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }
}
