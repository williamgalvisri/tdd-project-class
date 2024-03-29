import { render, screen } from "@testing-library/angular"
import { AppComponent } from "./app.component"
import { HomeComponent } from "./home/home.component"
import { SignUpComponent } from "./sign-up/sign-up.component"
import { HttpClientModule } from "@angular/common/http"
import { SharedModule } from "./shared/shared.module"
import { ReactiveFormsModule } from "@angular/forms"
import { routes } from "./router/app-router.module"


describe('Routing', () => {
    it('displays homepage at /', async () => {
        const { navigate } = await render(AppComponent, {
            declarations: [HomeComponent, SignUpComponent],
            imports: [HttpClientModule, SharedModule, ReactiveFormsModule],
            routes: routes
        })
        await navigate('/');
        const page = screen.queryByTestId("home-page");
        expect(page).toBeInTheDocument()

    })
})